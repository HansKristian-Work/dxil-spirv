Texture2D<float4> Tex2D : register(t3);
Texture2DArray<float4> Tex2DArray : register(t4);
TextureCube<float4> TexCube : register(t6);
TextureCubeArray<float4> TexCubeArray : register(t7);

SamplerComparisonState Samp : register(s1);

float4 main(float4 UV : TEXCOORD, nointerpolation int2 off : OFF) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Tex2D.GatherCmp(Samp, UV.xy, UV.z);
	res += Tex2DArray.GatherCmp(Samp, UV.xyz, UV.w);
	res += TexCube.GatherCmp(Samp, UV.xyz, UV.w);
	res += TexCubeArray.GatherCmp(Samp, UV, UV.w);

	res += Tex2D.GatherCmp(Samp, UV.xy, UV.z, off);

	return res;
}
