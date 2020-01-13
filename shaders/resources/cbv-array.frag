struct Foo
{
	float4 a[4];
};

ConstantBuffer<Foo> Buf[] : register(b0, space0);
ConstantBuffer<Foo> Buf2[100] : register(b0, space1);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return Buf[index].a[index & 3] + Buf2[index ^ 1].a[index & 1];
}
