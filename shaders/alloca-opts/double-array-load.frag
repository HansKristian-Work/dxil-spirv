struct Foo
{
	double4 b[6];
};

cbuffer Buf
{
	Foo foo;
};

float4 main(uint a : A, float4 p : P) : SV_Target
{
	double4 bs[6];
	[unroll]
	for (int i = 0; i < 6; i++)
		bs[i] = foo.b[i];

	return p * float4(bs[a % 6]);
}
