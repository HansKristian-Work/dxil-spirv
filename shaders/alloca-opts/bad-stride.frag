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
	bs[1] = foo.b[1];
	bs[2] = foo.b[3];

	return p * bs[a % 6];
}
