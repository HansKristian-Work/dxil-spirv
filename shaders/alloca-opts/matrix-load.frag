struct Foo
{
	float4x4 a[6];
};

cbuffer Buf
{
	float4 a;
	float4 b;
	Foo foo;
};

float4 main(uint a : A, float4 p : P) : SV_Target
{
	float4x4 as[3];
	[unroll]
	for (int i = 0; i < 3; i++)
		as[i] = foo.a[i];

	return as[a % 3][2] * p;
}
