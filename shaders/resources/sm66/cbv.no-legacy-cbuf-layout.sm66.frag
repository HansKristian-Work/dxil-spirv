cbuffer Cbuf
{
	float4 a;
	half4 b;
	int64_t4 c;
};

cbuffer Cbuf1 : register(b1)
{
	float4 d;
};

cbuffer Cbuf2 : register(b2)
{
	double4 e;
};

float4 main() : SV_Target
{
	return a + float4(b) + float4(c) + d + float4(e);
}
