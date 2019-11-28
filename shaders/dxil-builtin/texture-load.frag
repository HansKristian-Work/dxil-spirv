Texture1D<float2> Tex1D : register(t1);
Texture1DArray<float2> Tex1DArray : register(t2);
Texture2D<float2> Tex2D : register(t3);
Texture2DArray<float2> Tex2DArray : register(t4);
Texture3D<float2> Tex3D : register(t5);

Texture2DMS<float2> Tex2DMS : register(t6);
Texture2DMSArray<float2> Tex2DMSArray : register(t7);

RWTexture1D<float2> RWTex1D : register(u1);
RWTexture1DArray<float2> RWTex1DArray : register(u2);
RWTexture2D<float2> RWTex2D : register(u3);
RWTexture2DArray<float2> RWTex2DArray : register(u4);
RWTexture3D<float2> RWTex3D : register(u5);

float2 main(nointerpolation uint4 coord : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	res += Tex1D.Load(coord.xy);
	res += Tex1DArray.Load(coord.xyz);
	res += Tex2D.Load(coord.xyz);
	res += Tex2DArray.Load(coord.xyzw);
	res += Tex3D.Load(coord.xyzw);

	res += Tex2DMS.Load(coord.xy, coord.z);
	res += Tex2DMSArray.Load(coord.xyz, coord.w);

	res += RWTex1D.Load(coord.x);
	res += RWTex1DArray.Load(coord.xy);
	res += RWTex2D.Load(coord.xy);
	res += RWTex2DArray.Load(coord.xyz);
	res += RWTex3D.Load(coord.xyz);

	return res;
}
