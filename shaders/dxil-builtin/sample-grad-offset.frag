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

	res += Tex1D.SampleGrad(Samp, UV.x, UV.z, UV.w, 1);
	res += Tex1DArray.SampleGrad(Samp, UV.xy, UV.z, UV.y, 2);
	res += Tex2D.SampleGrad(Samp, UV.xy, UV.zz, UV.ww, int2(-3, -4));
	res += Tex2DArray.SampleGrad(Samp, UV.xyz, UV.zz, UV.ww, int2(4, -5));
	res += Tex3D.SampleGrad(Samp, UV.xyz, UV.zzz, UV.www, int3(5, 6, 7));

	return res;
}
