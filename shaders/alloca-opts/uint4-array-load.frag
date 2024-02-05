struct Foo
{
	uint4 b[6];
};

cbuffer Buf
{
	Foo foo;
};

uint4 main(uint a : A, float4 p : P) : SV_Target
{
	uint4 bs[6];
	[unroll]
	for (int i = 0; i < 6; i++)
		bs[i] = foo.b[i];

	return p * bs[a % 6];
}
