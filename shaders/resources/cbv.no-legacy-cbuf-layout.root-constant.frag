cbuffer A : register(b0, space0)
{
	float a;
	uint b;
	int c;
};

cbuffer B : register(b0, space1)
{
	float2 a2;
	uint b2;
	int c2;
};

float2 main() : SV_Target
{
	return (a + a2) + (b + b2) + (c + c2);
}
