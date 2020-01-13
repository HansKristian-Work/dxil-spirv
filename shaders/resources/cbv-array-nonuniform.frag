struct Foo
{
	float4 a[4];
};

// !!! DXC does not emit NonUniformResourceIndex here.

ConstantBuffer<Foo> Buf[] : register(b0, space0);
ConstantBuffer<Foo> Buf2[100] : register(b0, space1);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return Buf[NonUniformResourceIndex(index)].a[index & 3] + Buf2[NonUniformResourceIndex(index ^ 1)].a[index & 1];
}
