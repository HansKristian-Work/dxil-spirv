Texture2D<float4> Tex2D : register(t3);
Texture2DArray<float4> Tex2DArray : register(t4);

SamplerComparisonState Samp : register(s1);

float4 main(float4 UV : TEXCOORD) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Tex2D.GatherCmp(Samp, UV.xy, UV.z, int2(-3, -4));
	res += Tex2DArray.GatherCmp(Samp, UV.xyz, UV.w, int2(-4, -5));

	return res;
}
