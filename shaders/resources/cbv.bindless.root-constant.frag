struct Foo
{
	float4 v;
};

ConstantBuffer<Foo> uFoo : register(b3);
ConstantBuffer<Foo> uFooArray[64] : register(b4);
ConstantBuffer<Foo> uFooBindless[] : register(b100);

cbuffer Root : register(b0)
{
	uint index;
};

float4 main(nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	float4 result = uFoo.v;
	result += uFooArray[1].v;
	result += uFooArray[index].v;
	// DXC is buggy and does not emit NonUniformResourceIndex correctly in the DXIL.
	result += uFooBindless[NonUniformResourceIndex(dynamic_index)].v;
	return result;
}
