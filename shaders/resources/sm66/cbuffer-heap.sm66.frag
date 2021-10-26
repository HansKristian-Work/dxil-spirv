struct Foo { int4 v; };

float4 main(uint index : INDEX, float3 uv : UV) : SV_Target
{
	Texture3D<float4> tex = ResourceDescriptorHeap[index + 1];
	ConstantBuffer<Foo> cbuf = ResourceDescriptorHeap[index + 2];
	return tex.Load(cbuf.v);
}
