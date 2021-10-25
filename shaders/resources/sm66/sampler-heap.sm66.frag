float4 main(uint index : INDEX, float3 uv : UV) : SV_Target
{
	Texture3D<float4> tex = ResourceDescriptorHeap[index + 1];
	SamplerState samp = SamplerDescriptorHeap[index + 2];
	return tex.Sample(samp, uv);
}
