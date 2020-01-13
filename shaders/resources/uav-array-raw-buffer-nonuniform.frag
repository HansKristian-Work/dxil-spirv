RWByteAddressBuffer Tex[] : register(u0, space0);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return asfloat(Tex[NonUniformResourceIndex(index)].Load4(16 * index));
}
