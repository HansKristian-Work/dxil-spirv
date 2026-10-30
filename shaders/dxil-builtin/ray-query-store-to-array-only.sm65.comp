RaytracingAccelerationStructure RTAS : register(t0);
RWStructuredBuffer<uint> O : register(u0);
static RayQuery<RAY_FLAG_NONE> g_queries[2];

[numthreads(64, 1, 1)]
void main(uint i : SV_DispatchThreadID)
{
	RayDesc ray = { float3(0, 0, 0), 0.0, float3(0, 0, 1), 1.0 };
	RayQuery<RAY_FLAG_NONE> q;
	g_queries[i & 1] = q;
	RayQuery<RAY_FLAG_NONE> q2 = g_queries[i & 1];
	q2.TraceRayInline(RTAS, 0, 0xff, ray);
	O[i] = q2.CandidatePrimitiveIndex();
}
