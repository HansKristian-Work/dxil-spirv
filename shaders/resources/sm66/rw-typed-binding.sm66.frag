RWTexture2D<float> RO[] : register(u0, space0);
RWBuffer<uint> WR[] : register(u0, space1);
globallycoherent RWTexture2D<int> RW[] : register(u0, space2);
globallycoherent RWTexture1D<uint> ATOM[] : register(u0, space3);

float3 main(uint index : INDEX, int3 uv : UV) : SV_Target
{
	float3 res;

	res.x = RO[index].Load(uv.xy);
	WR[index][uv.x] = uv.y;
	res.y = float(RW[index].Load(uv.yz));
	RW[index][uv.yz] = uv.x;

	uint o;
	InterlockedAdd(ATOM[index][uv.x], uv.y, o);
	res.z = float(o);

	return res;
}
