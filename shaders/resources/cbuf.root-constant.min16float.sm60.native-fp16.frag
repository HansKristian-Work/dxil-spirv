cbuffer Foo
{
	min16float4 a;
	min16float4 b;
};

min16float4 main(min16float4 c : C) : SV_Target
{
	return a + b + c;
}
