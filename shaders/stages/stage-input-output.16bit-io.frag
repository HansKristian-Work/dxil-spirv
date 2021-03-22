struct StageIn
{
	half2 a : A;
	int16_t2 b : B;
	uint16_t c : C;
};

struct StageOut
{
	half2 a : SV_Target0;
	int16_t2 b : SV_Target1;
	uint16_t c : SV_Target2;
};

StageOut main(StageIn inputs)
{
	StageOut outputs;
	outputs.a = inputs.a * half(8.0);
	outputs.b = inputs.b * int16_t(-8);
	outputs.c = inputs.c * uint16_t(4);
	return outputs;
}
