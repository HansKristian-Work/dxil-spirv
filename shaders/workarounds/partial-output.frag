struct PSOut
{
	float arr2 : SV_Target4;
};

void main(float2 v : V, out PSOut psout)
{
	[branch]
	if (v.x == 10.0)
	{
		psout.arr2 = 40.0;
	}
	else if (v.x == 20.0)
	{
		psout.arr2 = 50.0;
	}
}
