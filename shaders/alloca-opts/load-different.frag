struct Foo
{
	float a, b, c, d;
};

cbuffer Buf
{
	Foo foo;
};

cbuffer Buf2
{
	Foo foo2;
};

float4 main(uint a : A, float4 p : P) : SV_Target
{
	float same[4];
	float diff[4];

	same[0] = foo.a;
	same[1] = foo.b;
	same[2] = foo.c;
	same[3] = foo.d;

	diff[0] = foo.a;
	diff[1] = foo.b;
	diff[2] = foo2.c;
	diff[3] = foo2.d;

	return p * same[a % 4] * diff[a % 4];
}
