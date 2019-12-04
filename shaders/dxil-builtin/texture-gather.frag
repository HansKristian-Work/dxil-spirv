Texture2D<float4> Tex2D : register(t3);
Texture2DArray<float4> Tex2DArray : register(t4);
TextureCube<float4> TexCube : register(t6);
TextureCubeArray<float4> TexCubeArray : register(t7);

SamplerState Samp : register(s1);

float4 main(float4 UV : TEXCOORD) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Tex2D.Gather(Samp, UV.xy);
	res += Tex2DArray.GatherGreen(Samp, UV.xyz);
	res += TexCube.GatherBlue(Samp, UV.xyz);
	res += TexCubeArray.GatherAlpha(Samp, UV);

	return res;
}
