Texture1D<float2> Tex1D : register(t0, space1);
Texture1DArray<float> Tex1DArray : register(t1, space1);
Texture2D<float2> Tex2D : register(t2, space1);
Texture2DArray<float> Tex2DArray : register(t3, space1);
Texture3D<float2> Tex3D : register(t4, space1);
TextureCube<float2> TexCube : register(t5, space1);
TextureCubeArray<float> TexCubeArray : register(t6, space1);

SamplerState Samp : register(s0);

float2 main(float4 UV : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;

	// Sample without bias.
	res += Tex1D.Sample(Samp, UV.x);
	res += Tex1DArray.Sample(Samp, UV.xy);
	res += Tex1DArray.Sample(Samp, UV.xy);
	res += Tex2D.Sample(Samp, UV.xy);
	res += Tex2DArray.Sample(Samp, UV.xyz);
	res += Tex3D.Sample(Samp, UV.xyz);
	res += TexCube.Sample(Samp, UV.xyz);
	res += TexCubeArray.Sample(Samp, UV);

	return res;
}
