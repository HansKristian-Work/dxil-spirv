float4 main(uint index : INDEX, float2 uv : UV) : SV_Target
{
	Texture2D<float4> T = ResourceDescriptorHeap[index];
	return T.Load(int3(uv, 0));
}
