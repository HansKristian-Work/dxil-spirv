Buffer<float4> Tex[] : register(t0, space0);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return Tex[index].Load(index);
}
