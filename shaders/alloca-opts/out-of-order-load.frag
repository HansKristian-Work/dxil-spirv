struct Foo
{
	float4 b[6];
};

cbuffer Buf
{
	Foo foo;
};

float4 main(uint a : A, float4 p : P) : SV_Target
{
	float4 bs[6];

	bs[0] = foo.b[0];
	bs[5] = foo.b[5];
	bs[3] = foo.b[3];

	return p * bs[a % 6];
}
