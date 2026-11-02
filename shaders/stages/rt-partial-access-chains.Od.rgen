struct Base
{
	float a;
};

struct Middle : Base
{
	float b;
	float Sum() { return a + b; }
};

struct Payload : Middle
{
	float c;
};

RaytracingAccelerationStructure RTAS : register(t0);
RWStructuredBuffer<float> O : register(u0);

[shader("raygeneration")]
void raygen()
{
	Payload p = (Payload)0;
	RayDesc ray = { float3(0, 0, 0), 0.0, float3(0, 0, 1), 1.0 };
	TraceRay(RTAS, RAY_FLAG_NONE, 0xff, 0, 1, 0, ray, p);
	O[0] = p.Sum();
}
