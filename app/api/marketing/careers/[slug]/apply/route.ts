import { NextResponse } from "next/server";
import { getJobListingBySlug, submitJobApplication } from "@/src/services/marketing.service";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const job = await getJobListingBySlug(slug);
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    const body = await req.json();
    const application = await submitJobApplication({
      jobId: job.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      coverLetter: body.coverLetter,
      resumeUrl: body.resumeUrl,
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
