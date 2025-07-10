struct Foo { float4 v; };
ConstantBuffer<Foo> CBV[3] : register(b5);
float4 main(uint v : V) : SV_Target
{
	return CBV[0].v + CBV[2].v + CBV[v].v;
}

