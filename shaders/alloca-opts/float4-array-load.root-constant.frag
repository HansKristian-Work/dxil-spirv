struct Foo
{
	float4 b0;
	float4 b1;
	float4 b2;
};

cbuffer Buf : register(b0)
{
	Foo foo;
};

cbuffer BufForward : register(b3)
{
	Foo foo2;
};

float4 main(uint a : A, float4 p : P) : SV_Target
{
	float4 bs[3];
	float4 cs[3];

	bs[0] = foo.b0;
	bs[1] = foo.b1;
	bs[2] = foo.b2;

	cs[0] = foo2.b0;
	cs[1] = foo2.b1;
	cs[2] = foo2.b2;

	return p * bs[a % 3] + cs[a % 3];
}
