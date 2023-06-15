Texture1D<float2> Tex1D : register(t1);
Texture1DArray<float2> Tex1DArray : register(t2);
Texture2D<float2> Tex2D : register(t3);
Texture2DArray<float2> Tex2DArray : register(t4);
Texture3D<float2> Tex3D : register(t5);

Texture2DMS<float2> Tex2DMS : register(t6);
Texture2DMSArray<float2> Tex2DMSArray : register(t7);

cbuffer Offsets : register(b0)
{
	int off;
	int2 off2;
	int3 off3;
};

float2 main(nointerpolation uint4 coord : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	res += Tex1D.Load(coord.xy, off);
	res += Tex1DArray.Load(coord.xyz, off);
	res += Tex2D.Load(coord.xyz, off2);
	res += Tex2DArray.Load(coord.xyzw, off2);
	res += Tex3D.Load(coord.xyzw, off3);

	res += Tex2DMS.Load(coord.xy, coord.z, off2);
	res += Tex2DMSArray.Load(coord.xyz, coord.w, off2);

	return res;
}
