RaytracingAccelerationStructure RTAS : register(t0);
RWStructuredBuffer<uint> O : register(u0);

[numthreads(64, 1, 1)]
void main(uint i : SV_DispatchThreadID)
{
	RayDesc ray = { float3(0, 0, 0), 0.0, float3(0, 0, 1), 1.0 };
	RayQuery<RAY_FLAG_NONE> q0;
	RayQuery<RAY_FLAG_NONE> q1;
	q0.TraceRayInline(RTAS, 0, 0xff, ray);
	q1.TraceRayInline(RTAS, 0, 0xff, ray);
	RayQuery<RAY_FLAG_NONE> q = (i & 1) ? q0 : q1;
	O[i] = q.CandidatePrimitiveIndex();
}
