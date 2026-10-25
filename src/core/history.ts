import type { GameState } from './types';

export function cloneGameState(state: GameState): GameState {
  return {
    ...state,
    stock: state.stock.map((c) => ({ ...c })),
    waste: state.waste.map((c) => ({ ...c })),
    foundations: [
      state.foundations[0].map((c) => ({ ...c })),
      state.foundations[1].map((c) => ({ ...c })),
      state.foundations[2].map((c) => ({ ...c })),
      state.foundations[3].map((c) => ({ ...c })),
    ],
    tableau: [
      state.tableau[0].map((c) => ({ ...c })),
      state.tableau[1].map((c) => ({ ...c })),
      state.tableau[2].map((c) => ({ ...c })),
      state.tableau[3].map((c) => ({ ...c })),
      state.tableau[4].map((c) => ({ ...c })),
      state.tableau[5].map((c) => ({ ...c })),
      state.tableau[6].map((c) => ({ ...c })),
    ],
  };
}

export class HistoryManager {
  private undoStack: GameState[] = [];
  private redoStack: GameState[] = [];
  private readonly maxHistory: number = 100;

  public pushState(state: GameState): void {
    this.undoStack.push(cloneGameState(state));
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  public undo(currentState: GameState): GameState | null {
    if (this.undoStack.length === 0) return null;
    const previousState = this.undoStack.pop()!;
    this.redoStack.push(cloneGameState(currentState));
    return previousState;
  }

  public redo(currentState: GameState): GameState | null {
    if (this.redoStack.length === 0) return null;
    const nextState = this.redoStack.pop()!;
    this.undoStack.push(cloneGameState(currentState));
    return nextState;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
