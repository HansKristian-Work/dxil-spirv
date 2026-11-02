tbuffer TB : register(t0)
{
	float4 a;
	float3 b;
};

float3 main() : SV_Target
{
	return a.yzw + b;
}
