float4 main(uint index : INDEX, float2 uv : UV) : SV_Target
{
	Texture2D<half4> tex = ResourceDescriptorHeap[NonUniformResourceIndex(index)];
	Buffer<unorm float4> buf = ResourceDescriptorHeap[NonUniformResourceIndex(index + 1)];
	Texture1D<float4> tex1d = ResourceDescriptorHeap[NonUniformResourceIndex(index + 2)];
	return float4(tex.Load(int3(uv, 0))) + buf[int(uv.x)] + tex1d.Load(int(uv.y));
}
