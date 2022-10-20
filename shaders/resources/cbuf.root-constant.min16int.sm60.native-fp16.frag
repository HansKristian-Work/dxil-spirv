cbuffer Foo
{
	min16int4 a;
	min16int4 b;
};

min16int4 main(min16float4 c : C) : SV_Target
{
	return a + b + min16int4(c);
}
