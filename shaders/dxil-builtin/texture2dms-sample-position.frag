uint index;
Texture2DMS<float4> t;

float4 main() : SV_Target
{
	return float4(t.GetSamplePosition(index), 0, 0);
}
