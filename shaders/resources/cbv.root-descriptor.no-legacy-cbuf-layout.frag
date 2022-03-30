cbuffer Buf : register(b0)
{
	float4 a;
	half4 c;
	int64_t4 b;
};

float4 main() : SV_Target
{
	float4 res = 0.0.xxxx;
	res += a;
	res += float4(b);
	res += float4(c);
	return res;
}
