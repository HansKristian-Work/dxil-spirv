struct Foo
{
	float4 pos : SV_Position;
	bool v : V;
};

Foo main(bool a : A)
{
	Foo foo;
	foo.pos = 1.0.xxxx;
	foo.v = true;
	return foo;
}
