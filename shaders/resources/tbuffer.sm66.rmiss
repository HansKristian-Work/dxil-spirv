tbuffer TB : register(t0)
{
	float4 a;
	float3 b;
};

struct Payload
{
	float4 a;
	float3 b;
};

[shader("miss")]
void main(inout Payload p)
{
	p.a = a;
	p.b = b;
}
