Texture2D<float4> T[3] : register(t5);
float4 main(uint v : V) : SV_Target
{
	return T[0].Load(int3(0, 0, 0)) + T[2].Load(int3(0, 0, 0)) + T[v].Load(int3(0, 0, 0));
}

