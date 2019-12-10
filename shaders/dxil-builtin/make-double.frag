float main(nointerpolation uint2 values : VALUE) : SV_Target
{
	return float(asdouble(values.x, values.y));
}
