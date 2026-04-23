import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// ── Config ──
const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET = process.env.S3_BUCKET || "rankly-resumes-yourname";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const dynamodb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION })
);
const s3 = new S3Client({ region: REGION });

// ── CORS Headers ──
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const respond = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

// ══════════════════════════════════════════════
//  MAIN HANDLER
// ══════════════════════════════════════════════
export const handler = async (event) => {
  const method = event.httpMethod;
  const path = event.path;
  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    body = {};
  }

  console.log(`[Rankly] ${method} ${path}`);

  try {
    // ── CORS preflight ──
    if (method === "OPTIONS") {
      return respond(200, { message: "OK" });
    }

    // ════════════════════════════════════════
    //  AUTH ROUTES
    // ════════════════════════════════════════

    // POST /api/signup
    if (method === "POST" && path === "/api/signup") {
      // Check if user already exists
      const existing = await dynamodb.send(
        new ScanCommand({
          TableName: "rankly-users",
          FilterExpression: "email = :email",
          ExpressionAttributeValues: { ":email": body.email },
        })
      );
      if (existing.Items && existing.Items.length > 0) {
        return respond(409, { error: "User with this email already exists" });
      }

      const userId = "u_" + crypto.randomUUID().slice(0, 8);
      const user = {
        userId,
        email: body.email,
        name: body.name,
        role: body.role, // "candidate" or "recruiter"
        passwordHash: body.password, // NOTE: In production, hash with bcrypt!
        createdAt: new Date().toISOString(),
      };

      await dynamodb.send(
        new PutCommand({ TableName: "rankly-users", Item: user })
      );

      return respond(200, {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    // POST /api/login
    if (method === "POST" && path === "/api/login") {
      const result = await dynamodb.send(
        new ScanCommand({
          TableName: "rankly-users",
          FilterExpression: "email = :email",
          ExpressionAttributeValues: { ":email": body.email },
        })
      );

      const user = result.Items?.[0];
      if (!user || user.passwordHash !== body.password) {
        return respond(401, { error: "Invalid email or password" });
      }

      return respond(200, {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    // ════════════════════════════════════════
    //  JOB ROUTES
    // ════════════════════════════════════════

    // GET /api/jobs — list all jobs
    if (method === "GET" && path === "/api/jobs") {
      const result = await dynamodb.send(
        new ScanCommand({ TableName: "rankly-jobs" })
      );
      // Sort by newest first
      const jobs = (result.Items || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return respond(200, jobs);
    }

    // POST /api/jobs — create a new job (recruiter)
    if (method === "POST" && path === "/api/jobs") {
      const jobId = "job_" + crypto.randomUUID().slice(0, 8);
      const job = {
        jobId,
        recruiterId: body.recruiterId || "unknown",
        title: body.title,
        company: body.company,
        category: body.category || "IT & Software",
        workType: body.workType || "Remote",
        experience: body.experience || "",
        salary: body.salary || "",
        location: body.location || "",
        description: body.description || "",
        skills:
          typeof body.skills === "string"
            ? body.skills.split(",").map((s) => s.trim())
            : body.skills || [],
        status: "Active",
        applicantCount: 0,
        createdAt: new Date().toISOString(),
      };

      await dynamodb.send(
        new PutCommand({ TableName: "rankly-jobs", Item: job })
      );

      return respond(200, job);
    }

    // ════════════════════════════════════════
    //  RESUME UPLOAD — Pre-signed URL
    // ════════════════════════════════════════

    // POST /api/upload-url
    if (method === "POST" && path === "/api/upload-url") {
      const key = `resumes/${body.candidateId}/${body.jobId}_${Date.now()}.pdf`;
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: "application/pdf",
      });
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
      return respond(200, { uploadUrl, s3Key: key });
    }

    // POST /api/download-url
    if (method === "POST" && path === "/api/download-url") {
      if (!body.resumeS3Key) {
        return respond(400, { error: "resumeS3Key is required" });
      }
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: body.resumeS3Key,
      });
      const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return respond(200, { downloadUrl });
    }

    // ════════════════════════════════════════
    //  APPLICATION ROUTES
    // ════════════════════════════════════════

    // POST /api/apply — submit application + Groq AI scoring
    if (method === "POST" && path === "/api/apply") {
      const applicationId = "app_" + crypto.randomUUID().slice(0, 8);

      // Fetch the job details for AI context
      let job = null;
      try {
        const jobResult = await dynamodb.send(
          new GetCommand({
            TableName: "rankly-jobs",
            Key: { jobId: body.jobId },
          })
        );
        job = jobResult.Item;
      } catch (e) {
        console.error("Failed to fetch job for AI scoring:", e.message);
      }

      // Call Groq AI to analyze resume
      let aiResult = {
        score: 50,
        strengths: [],
        gaps: [],
        summary: "AI analysis could not be completed.",
      };

      if (GROQ_API_KEY && job && body.resumeText) {
        try {
          aiResult = await analyzeResumeWithGroq(body.resumeText, job);
        } catch (e) {
          console.error("Groq AI error:", e.message);
        }
      }

      const application = {
        applicationId,
        jobId: body.jobId,
        candidateId: body.candidateId || "anonymous",
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        coverNote: body.coverNote || "",
        resumeS3Key: body.resumeS3Key || "",
        resumeText: body.resumeText || "",
        score: aiResult.score,
        strengths: aiResult.strengths,
        gaps: aiResult.gaps,
        summary: aiResult.summary,
        appliedAt: new Date().toISOString(),
      };

      await dynamodb.send(
        new PutCommand({
          TableName: "rankly-applications",
          Item: application,
        })
      );

      // Increment applicant count on the job
      if (job) {
        try {
          await dynamodb.send(
            new UpdateCommand({
              TableName: "rankly-jobs",
              Key: { jobId: body.jobId },
              UpdateExpression:
                "SET applicantCount = if_not_exists(applicantCount, :zero) + :one",
              ExpressionAttributeValues: { ":zero": 0, ":one": 1 },
            })
          );
        } catch (e) {
          console.error("Failed to increment applicant count:", e.message);
        }
      }

      return respond(200, application);
    }

    // GET /api/applicants/{jobId} — get all applicants for a job
    if (method === "GET" && path.startsWith("/api/applicants/")) {
      const jobId = path.split("/api/applicants/")[1];

      const result = await dynamodb.send(
        new QueryCommand({
          TableName: "rankly-applications",
          IndexName: "jobId-index",
          KeyConditionExpression: "jobId = :jid",
          ExpressionAttributeValues: { ":jid": jobId },
        })
      );

      // Sort by score descending
      const applicants = (result.Items || [])
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((c, i) => ({ ...c, rank: i + 1 }));

      return respond(200, applicants);
    }

    // GET /api/recruiter-jobs/{recruiterId} — get jobs posted by a recruiter
    if (method === "GET" && path.startsWith("/api/recruiter-jobs/")) {
      const recruiterId = path.split("/api/recruiter-jobs/")[1];

      const result = await dynamodb.send(
        new ScanCommand({
          TableName: "rankly-jobs",
          FilterExpression: "recruiterId = :rid",
          ExpressionAttributeValues: { ":rid": recruiterId },
        })
      );

      const jobs = (result.Items || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return respond(200, jobs);
    }

    // ── Fallback ──
    return respond(404, { error: "Route not found" });
  } catch (err) {
    console.error("[Rankly] Error:", err);
    return respond(500, { error: err.message });
  }
};

// ══════════════════════════════════════════════
//  GROQ AI — Resume Analysis
// ══════════════════════════════════════════════
async function analyzeResumeWithGroq(resumeText, job) {
  const prompt = `You are an expert HR AI assistant. Analyze this candidate's resume against the job requirements and return a structured JSON evaluation.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Required Skills: ${(job.skills || []).join(", ")}
- Experience Required: ${job.experience || "Not specified"}
- Description: ${job.description || "Not provided"}

CANDIDATE RESUME TEXT:
${resumeText.substring(0, 3000)}

INSTRUCTIONS:
1. Score the candidate 0-100 based on skill match, experience relevance, and overall fit.
2. List the candidate's strengths that match the job requirements.
3. List skill/experience gaps relative to the job requirements.
4. Write a 2-3 sentence professional summary of the candidate's fit.

Return ONLY valid JSON in this exact format (no markdown fences, no explanation):
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "summary": "Professional 2-3 sentence summary..."
}`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Groq API error:", response.status, errText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    // Try to extract JSON from the response (handle markdown fences)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(100, Math.max(0, Number(parsed.score) || 50)),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
        summary: parsed.summary || "Analysis completed.",
      };
    }
    throw new Error("No JSON found in Groq response");
  } catch (parseErr) {
    console.error("Failed to parse Groq response:", parseErr.message);
    return {
      score: 50,
      strengths: [],
      gaps: [],
      summary: content.substring(0, 200) || "AI analysis completed.",
    };
  }
}
