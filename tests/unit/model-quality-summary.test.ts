import {describe, expect, it} from 'vitest';
import {summarize} from '../../scripts/model-quality-summary.mjs';

describe('model quality summary', () => {
  it('separates delivery units from attempts and excludes parent overlap/reviewer implementation', () => {
    const result = summarize({
      units: [
        {id: 'u1', count_as_delivery_unit: true, delivery_state: 'accepted', first_submission_disposition: 'accepted', correction_history_complete: true},
        {id: 'child', parent_id: 'u1', count_as_delivery_unit: true, delivery_state: 'accepted'},
        {id: 'u2', count_as_delivery_unit: true, delivery_state: 'awaiting_review', first_submission_disposition: 'pending', correction_history_complete: false},
        {id: 'u3', count_as_delivery_unit: false, delivery_state: 'blocked'}
      ],
      attempts: [
        {id: 'a1', unit_id: 'u1', actual_model: 'm1', role: 'implementer', status: 'accepted'},
        {id: 'a2', unit_id: 'u1', actual_model: 'm2', role: 'implementer', status: 'blocked'},
        {id: 'a3', unit_id: 'u1', actual_model: 'review', role: 'reviewer', status: 'accepted'},
        {id: 'a4', unit_id: 'u2', actual_model: 'm1', role: 'implementer', status: 'unmapped'}
      ],
      corrections: [{id: 'c1', unit_id: 'u1', cause: 'instruction_miss', confirmed: true, implementation_changed: true}]
    });
    expect(result.unitCounts).toEqual({all: 4, deliveryEligible: 2, deliveryState: {accepted: 1, rejected: 0, pending: 1, blocked: 0, unknown: 0}});
    expect(result.attempts.statusCounts).toEqual({accepted: 2, rejected: 0, pending: 0, blocked: 1, unknown: 1});
    expect(result.mixedImplementationUnits).toEqual(['u1']);
    expect(result.firstSubmission.acceptanceRate).toEqual({numerator: 1, denominator: 1, value: 1});
    expect(result.firstSubmission.reworkRate).toEqual({numerator: 1, denominator: 1, value: 1, excludedIncompleteHistory: 0});
    expect(result.correctionsByCause).toEqual({instruction_miss: 1});
    expect(result.modelRole).toHaveProperty('review / reviewer', expect.objectContaining({deliveryUnits: ['u1']}));
  });

  it('excludes pending, blocked, and unknown first submissions; counts rejected then repaired units as rework', () => {
    const result = summarize({units: [
      {id: 'accepted', count_as_delivery_unit: true, first_submission_disposition: 'accepted', correction_history_complete: true},
      {id: 'rejected-repaired', count_as_delivery_unit: true, first_submission_disposition: 'rejected', correction_history_complete: true},
      {id: 'pending', count_as_delivery_unit: true, first_submission_disposition: 'pending', correction_history_complete: true},
      {id: 'blocked', count_as_delivery_unit: true, first_submission_disposition: 'blocked', correction_history_complete: true},
      {id: 'unknown', count_as_delivery_unit: true, correction_history_complete: false}
    ], corrections: [
      {id: 'fix', unit_id: 'rejected-repaired', cause: 'implementation_defect', confirmed: true, implementation_changed: true}
    ]});
    expect(result.firstSubmission.acceptanceRate).toEqual({numerator: 1, denominator: 2, value: 0.5});
    expect(result.firstSubmission.reworkRate).toEqual({numerator: 1, denominator: 2, value: 0.5, excludedIncompleteHistory: 0});
  });

  it('deduplicates identical IDs, flags conflicts, and treats missing data as unknown', () => {
    const result = summarize({
      units: [{id: 'x', count_as_delivery_unit: true, delivery_state: 'mystery'}, {id: 'x', count_as_delivery_unit: true, delivery_state: 'mystery'}, {id: 'x', count_as_delivery_unit: true, delivery_state: 'blocked'}],
      attempts: [{id: 'a', unit_id: 'x', role: 'implementer', status: 'mystery'}, {id: 'a', unit_id: 'x', role: 'implementer', status: 'mystery'}]
    });
    expect(result.unitCounts.all).toBe(1);
    expect(result.unitCounts.deliveryState.unknown).toBe(1);
    expect(result.attempts.unique).toBe(1);
    expect(result.firstSubmission).toMatchObject({eligibleUnits: 0, excludedUnknown: 1, acceptanceRate: {numerator: 0, denominator: 0, value: null}});
    expect(result.duplicateConflicts).toEqual(['x']);
    expect(result.notice).toContain('not fresh acceptance verification');
  });
});
