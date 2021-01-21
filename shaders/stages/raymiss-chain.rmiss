struct Payload
{
	float4 color;
};

RaytracingAccelerationStructure AS : register(t0);

[shader("miss")]
void RayMiss(inout Payload payload)
{
	RayDesc ray;
	ray.Origin = float3(1, 2, 3);
	ray.Direction = float3(0, 0, 1);
	ray.TMin = 1.0;
	ray.TMax = 4.0;
	TraceRay(AS, RAY_FLAG_NONE, 0, 0, 0, 0, ray, payload);
}

