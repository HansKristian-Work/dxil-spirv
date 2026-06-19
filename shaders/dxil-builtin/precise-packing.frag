float main(float v : V) : SV_Target
{
	// This doesn't need precise to be observed.
	return float(float16_t(v));
}
