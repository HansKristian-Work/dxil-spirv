cbuffer A : register(b0, space15)
{
	float a;
	uint b;
	int c;
};

cbuffer B : register(b1, space15)
{
	float2 a2;
	uint b2;
	int c2;
};

struct Payload
{
	float4 f;
	int4 i;
};

[shader("miss")]
void main(inout Payload payload)
{
	payload.f = float4(a, b, c, 1.0);
	payload.i = int4(a2, b2, c);
}
