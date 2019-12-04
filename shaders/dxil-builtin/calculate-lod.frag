Texture1D<float> Tex1D : register(t0);
Texture1DArray<float> Tex1DArray : register(t1);
Texture2D<float> Tex2D : register(t2);
Texture2DArray<float> Tex2DArray : register(t3);
Texture3D<float> Tex3D : register(t4);
TextureCube<float> TexCube : register(t5);
TextureCubeArray<float> TexCubeArray : register(t6);

SamplerState Samp : register(s0);

float2 main(float3 UV : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;

	res.x += Tex1D.CalculateLevelOfDetail(Samp, UV.x);
	res.x += Tex1DArray.CalculateLevelOfDetail(Samp, UV.x);
	res.x += Tex2D.CalculateLevelOfDetail(Samp, UV.xy);
	res.x += Tex2DArray.CalculateLevelOfDetail(Samp, UV.xy);
	res.x += Tex3D.CalculateLevelOfDetail(Samp, UV.xyz);
	res.x += TexCube.CalculateLevelOfDetail(Samp, UV.xyz);
	res.x += TexCubeArray.CalculateLevelOfDetail(Samp, UV.xyz);

	res.y += Tex1D.CalculateLevelOfDetailUnclamped(Samp, UV.x);
	res.y += Tex1DArray.CalculateLevelOfDetailUnclamped(Samp, UV.x);
	res.y += Tex2D.CalculateLevelOfDetailUnclamped(Samp, UV.xy);
	res.y += Tex2DArray.CalculateLevelOfDetailUnclamped(Samp, UV.xy);
	res.y += Tex3D.CalculateLevelOfDetailUnclamped(Samp, UV.xyz);
	res.y += TexCube.CalculateLevelOfDetailUnclamped(Samp, UV.xyz);
	res.y += TexCubeArray.CalculateLevelOfDetailUnclamped(Samp, UV.xyz);

	return res;
}
