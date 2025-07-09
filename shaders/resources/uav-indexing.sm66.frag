RWTexture2D<float4> T[3] : register(u5);
float4 main(uint v : V) : SV_Target
{
	return T[0].Load(int2(0, 0)) + T[2].Load(int2(0, 0)) + T[v].Load(int2(0, 0));
}

