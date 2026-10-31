struct Wrapper
{
	float4 a;
	float4 b;
};

struct Holder
{
	ConstantBuffer<Wrapper> cb;
};

Holder H : register(b0);

float4 main() : SV_Target
{
	return H.cb.a + H.cb.b;
}
