tbuffer TB : register(t0)
{
	float4 v;
};

float4 main() : SV_Target
{
	return v;
}
