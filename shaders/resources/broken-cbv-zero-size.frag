template<typename T>
struct Wrapper
{
	T value;
};

struct Holder
{
	ConstantBuffer<Wrapper<float4> > cb;
};

Holder H : register(b0);

float4 main() : SV_Target
{
	return H.cb.value;
}
