Texture1D<float2> Tex1D : register(t1);
Texture1DArray<float2> Tex1DArray : register(t2);
Texture2D<float2> Tex2D : register(t3);
Texture2DArray<float2> Tex2DArray : register(t4);
Texture3D<float2> Tex3D : register(t5);

Texture2DMS<float2> Tex2DMS : register(t6);
Texture2DMSArray<float2> Tex2DMSArray : register(t7);

float2 main(nointerpolation uint4 coord : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	res += Tex1D.Load(coord.xy, 1);
	res += Tex1DArray.Load(coord.xyz, 2);
	res += Tex2D.Load(coord.xyz, int2(3, 4));
	res += Tex2DArray.Load(coord.xyzw, int2(-4, -3));
	res += Tex3D.Load(coord.xyzw, int3(-4, 2, 3));

	res += Tex2DMS.Load(coord.xy, coord.z, int2(2, 3));
	res += Tex2DMSArray.Load(coord.xyz, coord.w, int2(4, 5));

	return res;
}
